import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { matchProfiles } from '@/app/actions/profile-matching';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LoaderCircle, User, Briefcase, GraduationCap, Eye } from '@/assets/svgs';
import pluralize from 'pluralize';
import Link from 'next/link';

interface MatchingResultsProps {
  parsedProfile: any;
  visible: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function MatchingResults({ 
  parsedProfile, 
  visible, 
  isLoading, 
  setIsLoading 
}: MatchingResultsProps) {
  const [matchingResults, setMatchingResults] = useState<any>(null);

  useEffect(() => {
    if (!visible || !parsedProfile) return;
    
    // Reset state when a new profile is received
    setMatchingResults(null);
    setIsLoading(true);
    
    const fetchMatchingProfiles = async () => {
      try {
        const profile_key = parsedProfile?.data?.profile?.key;
        const result = await matchProfiles(profile_key);
        
        if (result.success) {
          setMatchingResults(result.data);
        } else {
          toast.error('Matching Failed', {
            description: result.error || 'Failed to match profiles'
          });
        }
      } catch (err: any) {
        toast.error('Matching Error', {
          description: err.message || 'An error occurred while matching profiles'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatchingProfiles();
  }, [parsedProfile, visible]);

  if (!visible) return null;

  return (
    <>  
      {isLoading && !matchingResults ? (
        <div className="flex flex-col items-center py-8">
          <LoaderCircle className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <h3 className='text-md font-medium text-slate-500'>Processing...</h3>
        </div>
      ) : matchingResults ? (
        <div className="space-y-6">
          <div className='flex flex-col items-center justify-center text-center py-4 gap-2'>
            <Badge className="inline-block py-1 px-3 rounded-full bg-blue-200 text-xs font-semibold text-slate-900 mb-2">Results</Badge>
            <h2 className="text-2xl font-semibold tracking-tight">Profile Matches</h2>
            <p className="text-slate-500 font-medium text-base max-w-md mx-auto">
              {"Based on your CV, we've identified the following matches ranked by relevance"}
            </p>
          </div>
          
          {matchingResults.data?.profiles?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(() => {
                // Extract scores from predictions
                const scores: number[] = matchingResults.data.predictions.map((prediction: any) => prediction[1]);
                
                // Group profiles by source_key
                const sourceProfiles: Record<string, Array<{profile: any, score: number}>> = {};
                matchingResults.data.profiles.forEach((profile: any, index: number) => {
                  const sourceKey = profile.source?.key;
                  if (!sourceKey) return;
                  
                  if (!sourceProfiles[sourceKey]) {
                    sourceProfiles[sourceKey] = [];
                  }
                  sourceProfiles[sourceKey].push({ profile, score: scores[index] });
                });
                
                // Get source entries
                const sourceEntries = Object.entries(sourceProfiles);
                
                return sourceEntries.map(([sourceKey, profiles]) => {
                  // Choose icon based on source name
                  let icon;
                  let badgeClass = "";
                  let sourceName = "";
                  let progressBarClass = "";
                  
                  if (sourceKey === "e3ee5f76493820c3f316c26a103e50787bbbd398") {
                    icon = <User className="h-5 w-5 text-purple-500" />;
                    badgeClass = "bg-purple-100 text-purple-800 border-purple-200";
                    progressBarClass = "bg-purple-500";
                    sourceName = "EXPERIMENTE";
                  } else if (sourceKey === "bbf2ba7d8183599313e8d0df8e5a75fd55e8b62d") {
                    icon = <GraduationCap className="h-5 w-5 text-green-500" />;
                    badgeClass = "bg-green-100 text-green-800 border-green-200";
                    progressBarClass = "bg-green-600";
                    sourceName = "JUNIOR";
                  } else if (sourceKey === "0160565399cc174e01fe423816ea1a3687425001") {
                    icon = <Briefcase className="h-5 w-5 text-blue-500" />;
                    badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
                    progressBarClass = "bg-blue-500";
                    sourceName = "MANAGER";
                  }

                  // Calculate average score for this source
                  const avgScore = profiles.reduce((sum, { score }) => sum + score, 0) / profiles.length;
                  
                  // Sort profiles by score (highest first)
                  const sortedProfiles = [...profiles].sort((a, b) => b.score - a.score);
                  
                  return (
                    <div key={sourceKey} className="flex flex-col bg-white rounded-xl shadow-xs">
                      {/* Column Header */}
                      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className='rounded-full p-1.5 text-blue-600'>
                            {icon}
                          </div>
                          <h2 className="capitalize font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                            {sourceName.toLowerCase()}
                          </h2>
                        </div>
                        <div className="text-base font-semibold text-slate-900 ">
                          {(avgScore * 100).toFixed(0)}%
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                        {/* Profile Cards */}
                        {sortedProfiles.map(({ profile, score }, index) => {
                          const scorePercentage = Math.round(score * 100);
                          const rankNumber = index + 1;

                          const publicProfileUrl = profile?.attachments[0]?.public_url;
                          
                          return (
                            <div key={index}>
                            <Link href={publicProfileUrl} target='_blank' className="block relative group">
                              <motion.div  
                                key={index} 
                                className="bg-white rounded-xl border p-4 !border-slate-50 shadow-xl h-[220px] flex flex-col"
                                whileHover={{ 
                                  y: -8,
                                  transition: { duration: 0.6 }
                                }}
                                initial={{ y: 0 }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                                  <span className="text-slate-900 font-medium px-3 py-1 z-20 bg-white flex items-center gap-2 rounded-sm shadow text-semibold text-sm">
                                    <Eye className="h-5 w-5 text-slate-900" /> View CV
                                  </span>
                                </div>
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl font-semibold opacity-40">#{rankNumber}</span>
                                      <h3 className="font-semibold capitalize ">{profile.info?.full_name.toLowerCase() || 'Unnamed Profile'}</h3>
                                    </div>
                                    <Badge className={cn(badgeClass, 'text-[11px] max-w-[140px] px-2 py-1 capitalize')}>
                                      <span className='overflow-hidden text-ellipsis whitespace-nowrap '>{profile.experiences[0].title.toLowerCase()}</span>
                                    </Badge>
                                  </div>
                                  
                                  <div className="mb-3">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm font-medium text-gray-500">Relevance match</span>
                                      <span className="font-medium text-slate-900">{scorePercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={cn(progressBarClass, "h-2 rounded-full")} 
                                        style={{ width: `${scorePercentage}%` }}
                                      />
                                    </div>
                                  </div>
                                  
                                  {profile.experiences_duration && Math.round(profile.experiences_duration) > 0 && (
                                    <div className="text-sm text-gray-500 mb-3">
                                      Experience: 
                                      <span className="font-semibold text-slate-900 pl-2">
                                        {Math.round(profile.experiences_duration)} {pluralize('year', Math.round(profile.experiences_duration))}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {profile.skills && profile.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {profile.skills.slice(0, 3).map((skill: any, j: number) => (
                                        <Badge key={j} className="capitalize text-xs bg-slate-100 text-slate-900 py-1 px-2 rounded-md font-medium">
                                          {skill.name}
                                        </Badge>
                                      ))}
                                      {profile.skills.length > 3 && (
                                        <Badge className="ext-xs bg-slate-100 py-1 px-2 rounded-md font-medium text-slate-900">
                                          +{profile.skills.length - 3} more
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </motion.div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No matching profiles found
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}