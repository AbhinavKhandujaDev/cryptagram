import { NextResponse, NextRequest } from "next/server";

const domain = process.env.CLIENT_BASE_URL?.replace("/api", "");

const privateRoutes = [
  `${domain}/feeds`,
  `${domain}/create`,
  `${domain}/profile`,
  `${domain}/wallet`,
];

export async function middleware(req: NextRequest) {
  // let pageUrl = `${domain}${req.page.name}`;
  // let cookies = req.cookies;
  // let exists = cookies.idToken?.length > 0 && cookies.refreshToken?.length > 0;
  // if (privateRoutes.includes(pageUrl)) {
  //   if (!exists) {
  //     return NextResponse.redirect("/");
  //   }
  // } else if (req.nextUrl.toString() === "/" && exists) {
  //   return NextResponse.redirect("/feeds");
  // }
  return NextResponse.next();
}
