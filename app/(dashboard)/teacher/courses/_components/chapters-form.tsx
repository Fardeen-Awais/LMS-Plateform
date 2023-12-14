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
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";

interface ChapterFormProps {
    initialData: Course & {
        chapters: Chapter[]
    }
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

    return (
        <div className="mt-8 border bg-slate-100 rounded-md p-4">
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

                </div>
            )}

            {!isCreating && (
                <p className="text-sm text-muted-foreground mt-4">Drag and Drop to reorder the chapters</p>
            )}
        </div>
    )
}