export const resetState = ({ commit }) => {
  commit("resetState");
};

export const saveProject = ({ commit }, project) => {
  commit("saveProject", project);
};
