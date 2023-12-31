import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { IconBadge } from "@/components/icon-badge"
import { CircleDollarSign, LayoutDashboard, ListChecks } from "lucide-react"

import { TitleForm } from "../_components/title-form"
import { DescriptionForm } from "../_components/description-form"

import { AttachmentForm } from "../_components/attachment-form"

import { File } from "lucide-react"

import ImageForm from "../_components/image-form"
import { CategoryForm } from "../_components/categoryform"
import { PriceForm } from "../_components/priceform"
import { ChapterForm } from "../_components/chapters-form"

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      }
    },
  });
  const category = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  if (!course) {
    return redirect("/");
  }

  // ARRAY FOR REQUIRED FIELD
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedField = requiredFields.filter(Boolean).length;

  const completionText = `(${completedField}/${totalFields})`

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-500">complete all field {completionText}</span>
        </div>
      </div>
      {/* 2ND DIV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>

          <TitleForm
            initialData={course}
            courseId={course.id}
          />
          <DescriptionForm
            initialData={course}
            courseId={course.id}
          />

          <ImageForm
            initialData={course}
            courseId={course.id}
          />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={category.map((category) => ({
              value: category.id,
              label: category.name
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-3">
              <IconBadge icon={ListChecks} />
              <h2>Course Chapeter</h2>
            </div>
            <div>
              <ChapterForm
                initialData={course}
                courseId={course.id}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2>Sell your Course</h2>
            </div>
          </div>

          <PriceForm initialData={course} courseId={course.id} />
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2>Resources & Attachments</h2>
            </div>
            <AttachmentForm
              initialData={course}
              courseId={course.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseIdPage;