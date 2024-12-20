import { createContext, ReactNode, useContext, useState } from "react";

interface StudentContextProps {
  selectedStudents: string[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<string[]>>;
}

const StudentContext = createContext<StudentContextProps | undefined>(undefined);

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider = ({ children }: StudentProviderProps) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  return (
    <StudentContext.Provider value={{ selectedStudents, setSelectedStudents }}>
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
