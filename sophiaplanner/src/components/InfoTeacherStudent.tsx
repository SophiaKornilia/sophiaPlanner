import studentImg from "../assets/images/teacher.jpg";
import teacherImg from "../assets/images/student.jpg";

const InfoTeachersStudents = () => (
  <div className="h-screen w-full flex flex-col justify-start items-center bg-gradient-to-b from-primary to-background px-4 py-14 overflow-y-auto">
    {/* Header */}
    <div className="text-center mb-2 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-text mt-[-1rem] mb-2">
        För Lärare och Elever
      </h2>
      <p className="text-lg md:text-xl text-text-light">
        Upptäck hur SophiaPlanner förenklar undervisningen och lärandet.
      </p>
    </div>

    {/* Content Section */}
    <div className="flex flex-col md:flex-row items-center gap-4  mx-auto">
      {/* Teacher Section */}
      <div className="w-full md:w-1/2 bg-secondary p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-2xl font-bold text-text mb-3">För Lärare</h3>
        <p className="text-base md:text-lg text-text-light mb-4">
          Skapa strukturerade lektionsplaner, hantera scheman och ge dina elever
          en tydlig vägledning. Perfekt för att organisera din undervisning.
        </p>
        <img
          src={teacherImg}
          alt="För Lärare"
          className="mx-auto max-h-40 rounded-md shadow-md"
        />
      </div>

      {/* Student Section */}
      <div className="w-full md:w-1/2 bg-secondary p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-2xl font-bold text-text mb-3">För Elever</h3>
        <p className="text-base md:text-lg text-text-light mb-4">
          Få en tydlig översikt över dina lektioner, scheman och framsteg. Allt
          du behöver på ett ställe för att hålla dig organiserad och motiverad.
        </p>
        <img
          src={studentImg}
          alt="För Elever"
          className="mx-auto max-h-40 rounded-md shadow-md"
        />
      </div>
    </div>
  </div>
);

export default InfoTeachersStudents;
