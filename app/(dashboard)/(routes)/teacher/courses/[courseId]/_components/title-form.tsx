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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState } from "react";


interface TitleFormProps {
    initialData: {
        title: string;
    },
    courseId: string;
};


const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is Required",
    }),
});

export const TitleForm = ({
    initialData,
    courseId
}: TitleFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <div className="mt-8 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Title
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">{initialData.title}</p>
            )}

            {/* IN THIS SECTION HAS BEEN ERROR */}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder="e.g 'Advance Developement'" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={isSubmitting || !isValid} type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}