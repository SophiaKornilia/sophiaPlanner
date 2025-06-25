import studentImg from "../assets/images/teacher.jpg";
import teacherImg from "../assets/images/student.jpg";

const InfoTeachersStudents = () => (
  <div className="w-full max-w-5xl mx-auto flex flex-col justify-center items-center bg-secondary px-3 py-3 overflow-y-auto">
    <div className="flex flex-col md:flex-row items-start gap-2 sm:gap-3 w-full">
      {/* Lärarsektion */}
      <div className="w-full md:w-1/2 bg-secondary p-2 rounded-lg text-center">
        <h3 className="text-base font-semibold text-text mb-1">För Lärare</h3>
        <p className="text-xs text-text-light mb-2">
          Skapa lektionsplaner och hantera scheman enkelt. Få struktur i din
          undervisning.
        </p>
        <img
          src={teacherImg}
          alt="För Lärare"
          className="mx-auto max-h-20 rounded shadow-sm"
        />
      </div>

      {/* Elevsektion */}
      <div className="w-full md:w-1/2 bg-secondary p-2 rounded-lg text-center">
        <h3 className="text-base font-semibold text-text mb-1">För Elever</h3>
        <p className="text-xs text-text-light mb-2">
          Se dina lektioner, scheman och framsteg på ett ställe – håll dig
          organiserad.
        </p>
        <img
          src={studentImg}
          alt="För Elever"
          className="mx-auto max-h-20 rounded shadow-sm"
        />
      </div>
    </div>
  </div>
);

export default InfoTeachersStudents;
