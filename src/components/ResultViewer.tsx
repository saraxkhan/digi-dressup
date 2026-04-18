import React from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultViewerProps {
  personImage: string;
  resultImage: string;
  onReset: () => void;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ personImage, resultImage, onReset }) => {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = "virtual-tryon-result.png";
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <Tabs defaultValue="result" className="w-full">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="result" className="flex-1">Result</TabsTrigger>
          <TabsTrigger value="compare" className="flex-1">Compare</TabsTrigger>
        </TabsList>
        <TabsContent value="result">
          <div className="rounded-xl overflow-hidden border border-border aspect-[3/4] max-h-[60vh]">
            <img src={resultImage} alt="Try-on result" className="w-full h-full object-cover" />
          </div>
        </TabsContent>
        <TabsContent value="compare">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl overflow-hidden border border-border aspect-[3/4]">
              <p className="text-xs text-muted-foreground p-2 bg-card text-center">Before</p>
              <img src={personImage} alt="Before" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border aspect-[3/4]">
              <p className="text-xs text-muted-foreground p-2 bg-card text-center">After</p>
              <img src={resultImage} alt="After" className="w-full h-full object-cover" />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button onClick={handleDownload} className="flex-1 glow-primary">
          <Download className="w-4 h-4 mr-2" /> Download
        </Button>
        <Button onClick={onReset} variant="secondary" className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" /> Try Another
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultViewer;
