import { defineField, defineType } from 'sanity';
import { TagIcon } from 'lucide-react';

export const categoryType = defineType({
    name: "category",
    title: "Categories",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "title",
            type: "string",
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: {
                source: "title",
            },
        }),
        defineField({
            name: "description",
            type: "text",
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "description",
        }
    }
});