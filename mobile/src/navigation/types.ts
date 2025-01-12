export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Dashboard: undefined;
  Attendance: undefined;
  Homework: undefined;
  ExamResults: undefined;
  FeeDetails: undefined;
  BusTracking: undefined;
  Chat: undefined;
  Library: undefined;
  Calendar: undefined;
  Profile: undefined;
  ChangePassword: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
