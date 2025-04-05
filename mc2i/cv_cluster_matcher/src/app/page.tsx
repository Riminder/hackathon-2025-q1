"use client"
import { useState } from "react";
import { Badge } from "@/components/ui/badge"
import DropzoneSection from "@/components/sections/dropzone";
import MatchingResults from "@/components/sections/matching";
import { motion } from "framer-motion";

export default function Home() {
  const [parsedProfile, setParsedProfile] = useState<any>(null);
  const [parsingLoading, setParsingLoading] = useState(false);
  const [matchingLoading, setMatchingLoading] = useState(false);

  const handleParseSuccess = (data: any) => {
    setParsedProfile(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background">
      <motion.header 
        className="w-full text-center py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2">
          <Badge className="bg-blue-100 text-blue-500 mb-2">CV Cluster Matcher</Badge>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Match Your CV To Professional Profiles
          </h1>
          <p className="text-sm md:text-lg max-w-xl mx-auto text-slate-500 font-medium"> 
            Upload your CV to find the closest matching profiles across three professional clusters, ranked by relevance.
          </p>
        </div>
      </motion.header>
      <main className="w-full max-w-7xl mx-auto px-4 space-y-12 pb-20 flex flex-col items-center">
        <DropzoneSection 
          onParseSuccess={handleParseSuccess} 
          isLoading={parsingLoading || matchingLoading}
          setIsLoading={setParsingLoading}
        />
        <MatchingResults 
          parsedProfile={parsedProfile} 
          visible={parsingLoading || !!parsedProfile } 
          isLoading={parsingLoading || matchingLoading}
          setIsLoading={setMatchingLoading}
        />
      </main>
    </div>
  );
}