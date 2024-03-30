/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customorange: "rgba(199, 106, 48, 1)",
        darkblue: "rgba(25, 53, 106, 1)",
        lightblue: "rgba(26, 79, 123, 1)",
        skyblue: "rgba(48, 139, 131, 1)",
        attendence: "rgba(18, 51, 77, 1)",
        attendenceatableaHeader: "rgba(18, 51, 77, 1)",
        attendenceTableBody: "rgba(12, 40, 62, 1)",
        customyellow: "rgba(193, 156, 26, 1)",

        logout: "rgba(189, 68, 46, 1)",

        login: "rgba(25, 68, 124, 1)",
        login1: "rgba(25, 55, 107, 1)",
        login2: "rgba(84, 103, 138, 1)",
        login3: "rgba(62, 114, 204, 1)",
        /*actual colors */
        adminyellow: "rgba(202, 160, 0, 1)",
        adminlogin: "rgba(25, 53, 106, 1)",
        adminAttendence: "rgba(18, 51, 77, 1)",
        adminattendence1: "rgba(26, 44, 58, 1)",
        adminAttendence2: "rgba(19, 63, 96, 1)",

        adminprofile: "rgba(48, 139, 131, 1)",
        adminprofileblue: "rgba(26, 44, 57, 1)",
        adminprofileblue1: "rgba(103, 173, 178, 1)",

        admintimeorange: "rgba(249, 133, 60, 1)",
        admintimedark: "rgba(26, 44, 58, 1)",
        admintimeblue: "rgba(19, 62, 97, 1)",
        admintimegray: "rgba(174, 170, 195, .6)",

        adminresuls: "rgba(26, 79, 123, 1)",
        adminlightblue: "rgba(100, 175, 178, 1)",
        admindark: "rgba(26, 44, 58, 1)",
        adminlightdark: "rgba(19, 62, 97, 1)",

        studentlogin: "rgba(26, 52, 107, 1)",
        studentgray: "rgba(184, 182, 198, 1)",
        studentattendenceblue1: "rgba(18, 51, 77, 1)",
        studentdark: "rgba(26, 44, 58, 1)",
        studentblue2: "rgba(20, 62, 98, 1)",
        // studentPurple: "rgba(60, 62, 116, 1)",

        studentresult: "rgba(26, 79, 123, 1)",
        studentresultdark: "rgba(26, 44, 58, 1)",
        studendtresultlight: "rgba(19, 63, 96, 1)",

        studentmonthpurple: "rgba(60, 62, 116, 1)",
        studentmonthblue: "rgba(18, 51, 77, 1)",
        studentmonthgray: "rgba(66, 80, 110, 1)",
      },
    },
  },
  plugins: [],
};
