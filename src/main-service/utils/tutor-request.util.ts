export const isFullStudent = (tutorRequest) => {
  const { numOfStudents = 0, students = [] } = tutorRequest || {};
  if (students?.length < numOfStudents) return false;
  return true;
};
