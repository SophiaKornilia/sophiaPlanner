import { createContext, ReactNode, useContext, useState } from "react";

// Representerar en elev med id, namn och användarnamn.
interface Student {
  id: string;
  name: string;
  userName: string;
}

// Definierar vilka värden och funktioner som finns i contexten.
interface StudentContextProps {
  selectedStudents: string[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStudent: Student | null;
  setSelectedStudent: React.Dispatch<React.SetStateAction<Student | null>>;
}

// Context används för att dela data om valda elever över hela applikationen.
const StudentContext = createContext<StudentContextProps | undefined>(
  undefined
);
interface StudentProviderProps {
  children: ReactNode; // Barnkomponenter som kommer ha tillgång till contexten
}

// StudentProvider-komponenten ansvarar för att tillhandahålla StudentContext
// Hanterar tillstånd för valda elever och delar dessa till barnkomponenter.
export const StudentProvider = ({ children }: StudentProviderProps) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  return (
    <StudentContext.Provider
      value={{
        selectedStudents,
        setSelectedStudents,
        selectedStudent,
        setSelectedStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook för att använda StudentContext
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
};
