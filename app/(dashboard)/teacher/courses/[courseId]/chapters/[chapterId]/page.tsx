
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { ChapterTitleForm } from "./_components/chapter-title-form"
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";


const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  console.log(params.chapterId) // Msla yaha par tha chapterId jo hum yaha get krhay hai usi same name ka folder hona chayay: e.g [chapterId]. Is wja se hum ko ChapterId nhi mil parha tha aur bug arha tha
  console.log(params.courseId) //! Isko remove krdena prh kr
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });
  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creations</h1>
              <span className="text-sm text-slate-700">
                Completed all fields {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
         
<ChapterTitleForm
   initialData={chapter}
  courseId={params.courseId}
  chapterId={params.chapterId}
  />
  <ChapterDescriptionForm 
      initialData={chapter}
      courseId={params.courseId}
     chapterId={params.chapterId} 
   />
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">
                Access Settings
              </h2>
            </div>
            <ChapterAccessForm 
             initialData={chapter}
             courseId={params.courseId}
             chapterId={params.chapterId} 
            />

          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">
Add A Video
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
