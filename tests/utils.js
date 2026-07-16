const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const calculateTaskCompletionPercentage = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.done).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

module.exports = {
  validateEmail,
  calculateTaskCompletionPercentage,
};
