import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Briefcase } from "@/assets/svgs"

export default function ResumePreview({
  onClose,
  parsedProfile
}: {
  onClose: () => void,
  parsedProfile: any
}) {
  
  const profileData = parsedProfile?.data?.profile;
  return (
    <div className='flex flex-col gap-6 w-full'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <Avatar className='rounded-full h-16 w-16 border-2 border-white shadow-md'>
            <AvatarImage src={profileData?.info?.picture} />
            <AvatarFallback>
              {profileData?.info?.first_name?.charAt(0) + profileData?.info?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-0.5'>
            <h1 className='text-base font-bold text-gray-800 capitalize'>{profileData?.info?.full_name.toLowerCase()}</h1>
            <div className='text-xs text-gray-500 flex items-center gap-1 max-w-[250px]'>
              <MapPin className='h-3 w-3 -mt-0.5 text-gray-700 flex-shrink-0' />
              <span className='truncate whitespace-nowrap overflow-hidden'>{profileData?.info?.location.text}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center gap-1 max-w-[250px]'>
              <Briefcase className='h-3 w-3 -mt-0.5 text-gray-700 flex-shrink-0' />
              <span className='truncate whitespace-nowrap overflow-hidden'>
                {(() => {
                  if (!profileData?.experiences?.length) return '';
                  // Find the last experience with a non-empty title
                  for (let i = profileData.experiences.length - 1; i >= 0; i--) {
                    if (profileData.experiences[i]?.title?.trim()) {
                      return profileData.experiences[i].title;
                    }
                  }
                  return '';
                })()}
              </span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='text-xs text-gray-500 flex items-center gap-1'>
            <Mail className='h-3 w-3 -mt-0.5 text-gray-700' />
            {profileData?.info?.email}
          </div>
          <div className='text-xs text-gray-500 flex items-center gap-1'>
            <Phone className='h-3 w-3 -mt-0.5 text-gray-700' />
            {profileData?.info?.phone}
          </div>
        </div>
      </div>
      <div>
        <h2 className='font-semibold text-gray-800 pb-1'>About</h2>
        <p className='text-xs text-gray-500 line-clamp-3 overflow-hidden text-ellipsis'>
          {profileData?.info?.summary}
        </p>
      </div>
      <div
        className="absolute -top-3 -right-3 size-6 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors duration-200"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </div>
    </div>
  )
}
