'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  

import { usePathname } from "next/navigation"
import { Fragment } from "react";

export default function Breadcrumbs() {

    const path = usePathname();

    const segments = path.split('/');

    console.log(segments)

  return (

    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {segments.map((segment, index) => {
                if (!segment) return null

                const href = `a/${segments.slice(0, index + 1).join('/')}`;

                return (
                    <Fragment key ={segment}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem key={segment}>
                            <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Fragment>
                )
            })}
        </BreadcrumbList>
    </Breadcrumb>

  )
}