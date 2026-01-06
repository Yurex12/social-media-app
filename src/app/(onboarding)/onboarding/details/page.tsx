import { Camera, UserCircle, Pencil, Info } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileSettingsPage() {
  return (
    <div className='flex items-center justify-center min-h-[80vh] p-4'>
      <Card className='w-full max-w-sm border-gray-200 bg-white shadow-xl overflow-hidden'>
        {/* Header - Consistent with Username Page */}
        <CardHeader className='flex flex-col items-center justify-center pb-2'>
          <div className='inline-flex size-14 items-center justify-center rounded-full bg-indigo-50 mb-2'>
            <UserCircle className='h-7 w-7 text-indigo-600' />
          </div>
          <h1 className='text-2xl font-semibold text-gray-900'>Edit Profile</h1>
          <p className='text-sm text-gray-500'>How the community sees you</p>
        </CardHeader>

        <CardContent className='space-y-8 pt-6'>
          {/* Profile Picture Section */}
          <div className='flex flex-col items-center space-y-4'>
            <div className='relative group'>
              <Avatar className='size-24 border-4 border-white shadow-md ring-1 ring-gray-100'>
                <AvatarImage
                  src='https://github.com/shadcn.png'
                  alt='Profile'
                />
                <AvatarFallback className='bg-gray-50 text-gray-400'>
                  <UserCircle className='size-12' />
                </AvatarFallback>
              </Avatar>

              {/* Overlay Camera Icon (Visual cue for upload) */}
              <button className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                <Camera className='text-white size-6' />
              </button>

              <div className='absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-100'>
                <Pencil className='size-3 text-indigo-600' />
              </div>
            </div>
            <p className='text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer'>
              Change photo
            </p>
          </div>

          {/* Bio Section */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='bio'
                className='text-sm font-semibold text-gray-700'
              >
                Bio
              </Label>
              <span className='text-[10px] uppercase tracking-wider text-gray-400 font-bold'>
                160 Characters
              </span>
            </div>
            <div className='relative'>
              <Textarea
                id='bio'
                placeholder='Tell us about yourself...'
                className='resize-none min-h-25 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10 transition-all'
                maxLength={160}
              />
              <div className='absolute bottom-2 right-2 text-gray-300'>
                <Info className='size-4' />
              </div>
            </div>
            <p className='text-[11px] text-gray-500 leading-relaxed'>
              Brief description for your profile. URLs and @mentions are
              allowed.
            </p>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col gap-3 pb-8'>
          <Button className='w-full bg-linear-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-indigo-200'>
            Save Profile
          </Button>
          <Button
            variant='ghost'
            className='w-full text-gray-400 hover:text-gray-600 text-sm'
          >
            Skip for now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
