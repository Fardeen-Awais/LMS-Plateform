import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const ChapterIdPage = async ({ params }: { params: { courseId: string, chapterId: string } }) => {
  // console.log(params.chapterId) // Msla yaha par tha chapterId jo hum yaha get krhay hai usi same name ka folder hona chayay: e.g [chapterId]. Is wja se hum ko ChapterId nhi mil parha tha aur bug arha tha
  // console.log(params.courseId) //! Isko remove krdena prh kr
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    },
    include: {
      muxData: true
    },
  })
  if (!chapter) {
    return redirect("/")
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl
  ]

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center'>
        <div className='w-full'>
          <Link href={`/teacher/courses/${params.courseId}`} className='flex items-center text-sm hover:opacity-75 transition mb-6'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Course
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage