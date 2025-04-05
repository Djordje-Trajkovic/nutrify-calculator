import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/meal(.*)"])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    const urlThatWeAreNotAllowedToGoBackIfLogedIn = ["/login", "/register", "/"]

    if (
        userId &&
        urlThatWeAreNotAllowedToGoBackIfLogedIn.includes(req.nextUrl.pathname)
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (!userId && isProtectedRoute(req)) {
        return NextResponse.redirect(new URL("/login", req.url))
    }
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
}
