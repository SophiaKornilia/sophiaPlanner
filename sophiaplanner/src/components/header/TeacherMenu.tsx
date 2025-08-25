import { NavLink } from "react-router-dom";

type NavItemTeachers = { label: string; to: string };

const TEACHER_MENU: NavItemTeachers[] = [
  { label: "Skapa elevkonto", to: "/CreateStudentAccount" },
  { label: "Skapa elevplaneringar", to: "/CreateLessonPlan" },
  { label: "Översikt", to: "/DashboardTeacher" },
];

export const TeacherNavMenu = () => {
  return (
    <div className="hidden sm:flex items-center justify-end px-8 bg-primary h-14">
      <nav aria-label="Lärarmeny">
        <ul className="flex space-x-8 text-text">
          {TEACHER_MENU.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "font-semibold underline" : "hover:underline"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
