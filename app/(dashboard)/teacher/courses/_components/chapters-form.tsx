"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, PencilIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import { ChaptersList } from "./chapter-list";

interface ChapterFormProps {
    initialData: Course & { chapters: Chapter[] }
    courseId: string;
};


const formSchema = z.object({
    title: z.string().min(5),
});

export const ChapterForm = ({
    initialData,
    courseId
}: ChapterFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Course Description Updated");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Something Went wrong");
        }
    }

    const onReorder = async (updateData: { id: string, position: number }[]) => {
        try {
            setIsUpdating(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            }); // axios.put is used for updating data. It is typically used to update or modify existing resources on a server.
            toast.success("Chapter reordered successfully")
            router.refresh()
        } catch (error) {
            toast.error("Something Went wrong");
        } finally {
            setIsUpdating(false)
        }
    }

    const onEdit = (id: string) => {
        console.log(id) // this is working
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }

    return (
        <div className="relative mt-8 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"></Loader2>
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course Chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Add a Chapter
                        </>
                    )}

                </Button>
            </div>

            {/* IN THIS SECTION HAS BEEN ERROR */}
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea {...field} placeholder="Introduction to the course..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button disabled={isSubmitting || !isValid} type="submit">Create</Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}

            {!isCreating && (
                <p className="text-sm text-muted-foreground mt-4">Drag and Drop to reorder the chapters</p>
            )}
        </div>
    )
}