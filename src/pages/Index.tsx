import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUploader from "@/components/ImageUploader";
import ClothingConfig, { type ClothingOptions } from "@/components/ClothingConfig";
import SizeSelector, { type SizeOptions } from "@/components/SizeSelector";
import ResultViewer from "@/components/ResultViewer";
import StepIndicator from "@/components/StepIndicator";

const steps = ["Upload", "Configure", "Size & Fit", "Result"];

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [clothingOptions, setClothingOptions] = useState<ClothingOptions>({
    type: "stitched", clothingItem: "", fabricType: "", intendedOutfit: "",
  });
  const [sizeOptions, setSizeOptions] = useState<SizeOptions>({ size: "M", fit: "Regular" });
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const canNext = () => {
    if (step === 0) return !!personImage && !!clothingImage;
    if (step === 1) {
      if (clothingOptions.type === "stitched") return !!clothingOptions.clothingItem;
      return !!clothingOptions.fabricType && !!clothingOptions.intendedOutfit;
    }
    if (step === 2) return !!sizeOptions.size && !!sizeOptions.fit;
    return true;
  };

  const handleGenerate = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("virtual-tryon", {
        body: {
          personImage,
          clothingImage,
          clothingOptions,
          sizeOptions,
        },
      });

      if (error) {
        throw new Error(error.message || "Processing failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.resultImage) {
        throw new Error("No result image received");
      }

      setResultImage(data.resultImage);
      setStep(3);
    } catch (err: any) {
      console.error("Virtual try-on error:", err);
      toast({
        title: "Processing Failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setPersonImage(null);
    setClothingImage(null);
    setResultImage(null);
    setClothingOptions({ type: "stitched", clothingItem: "", fabricType: "", intendedOutfit: "" });
    setSizeOptions({ size: "M", fit: "Regular" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display font-bold text-lg gradient-text">DressAI</h1>
          </div>
          <span className="text-xs text-muted-foreground font-medium">Virtual Try-On</span>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8">
        <StepIndicator steps={steps} current={step} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="upload" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Upload Images</h2>
              <p className="text-sm text-muted-foreground mb-6">Add a photo of a person and the clothing item.</p>
              <div className="flex gap-4 flex-col sm:flex-row">
                <ImageUploader label="Person (full body)" icon="person" image={personImage} onImageChange={setPersonImage} />
                <ImageUploader label="Clothing Item" icon="clothing" image={clothingImage} onImageChange={setClothingImage} />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="config" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Configure Clothing</h2>
              <p className="text-sm text-muted-foreground mb-6">Tell us about the clothing item.</p>
              <ClothingConfig options={clothingOptions} onChange={setClothingOptions} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="size" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Size & Fit</h2>
              <p className="text-sm text-muted-foreground mb-6">Choose your preferred size and fit.</p>
              <SizeSelector options={sizeOptions} onChange={setSizeOptions} />
            </motion.div>
          )}

          {step === 3 && resultImage && personImage && (
            <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Your Look</h2>
              <p className="text-sm text-muted-foreground mb-6">Here's your AI-generated try-on.</p>
              <ResultViewer personImage={personImage} resultImage={resultImage} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing overlay */}
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4"
          >
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-display font-semibold text-foreground">AI is dressing you up...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </motion.div>
        )}

        {/* Navigation */}
        {step < 3 && (
          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="glow-primary">
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleGenerate} disabled={!canNext()} className="glow-primary">
                <Sparkles className="w-4 h-4 mr-1" /> Generate
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
