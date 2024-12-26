import { createContext, ReactNode, useContext, useState } from "react";

interface Student {
  id: string;
  name: string;
  userName: string; 
}

interface StudentContextProps {
  selectedStudents: string[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStudent: Student | null; // För att lagra en vald elev
  setSelectedStudent: React.Dispatch<React.SetStateAction<Student | null>>;
}

const StudentContext = createContext<StudentContextProps | undefined>(undefined);
interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider = ({ children }: StudentProviderProps) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  return (
    <StudentContext.Provider value={{ selectedStudents, setSelectedStudents, selectedStudent, setSelectedStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook för att använda context
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
};
