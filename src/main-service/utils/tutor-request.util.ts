export const isFullStudent = (tutorRequest) => {
  const { numOfStudents = 0, students = [] } = tutorRequest || {};
  if (students?.length < numOfStudents) return false;
  return true;
};

export const isUserInClass = (tutoRequest, userId) => {
  const { students = [] } = tutoRequest || {};
  return students.some((item) => item?.toString() === userId);
};
