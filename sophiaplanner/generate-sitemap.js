import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync } from "fs";

// Rutterna för din webbplats
const routes = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/CreateLessonPlan", changefreq: "monthly", priority: 0.8 },
  { path: "/CreateStudentAccount", changefreq: "monthly", priority: 0.7 },
  { path: "/DashboardStudent", changefreq: "monthly", priority: 0.7 },
  { path: "/DashboardTeacher", changefreq: "monthly", priority: 0.7 },
  { path: "/Planner", changefreq: "monthly", priority: 0.7 },
  { path: "/HandleAccount", changefreq: "monthly", priority: 0.7 },
  { path: "/LoginPage", changefreq: "monthly", priority: 0.7 },
  { path: "/Register", changefreq: "monthly", priority: 0.7 },
];

// Skapa sitemap
const hostname = "https://sophiaplanner-vercel.app";
const sitemap = new SitemapStream({ hostname });

// Lägg till alla rutter i sitemapen
routes.forEach((route) => {
  sitemap.write({
    url: route.path,
    changefreq: route.changefreq,
    priority: route.priority,
  });
});
sitemap.end();

// Skriv sitemap till en fil
streamToPromise(sitemap)
  .then((data) => {
    writeFileSync("./public/sitemap.xml", data);
    console.log("Sitemap skapad!");
  })
  .catch((err) => {
    console.error("Ett fel uppstod:", err);
  });
