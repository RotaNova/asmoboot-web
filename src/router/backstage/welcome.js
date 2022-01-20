export default {
  title: "首页",
  path: "welcome",
  name: "welcome",
  component: (resolve) =>
    require(["@/views/backstage/home/welcome.vue"], resolve),
};
