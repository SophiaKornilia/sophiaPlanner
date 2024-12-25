const InfoTeachersStudents = () => (
    <div className="h-screen flex justify-center items-center bg-background">
      <div className="w-full max-w-4xl bg-secondary p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-text mb-4">För lärare och elever</h2>
        <p className="text-lg text-text">
          <span className="font-semibold">Lärare:</span> Skapa strukturerade
          lektionsplaner. <br />
          <span className="font-semibold">Elever:</span> Få en tydlig översikt
          över lektioner och framsteg.
        </p>
        <img
          src="/path-to-teachers-students.jpg"
          alt="För lärare och elever"
          className="mt-6 mx-auto max-h-60"
        />
      </div>
    </div>
  );
  
  export default InfoTeachersStudents;
  