export const buildMessageBaseSystemInformation = (systemData, message) => {
  try {
    const contentArr = Object.keys(systemData).map((key) => {
      console.info(
        `LOG_IT:: contentData[key]?.length`,
        systemData[key]?.length,
      );
      return {
        role: "system",
        content: systemData[key],
      };
    });
    return [...contentArr, message];
  } catch (e) {
    console.info(`LOG_IT:: buildMessageBaseSystemInformation e`, e);
  }
};
