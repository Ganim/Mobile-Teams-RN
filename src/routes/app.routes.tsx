import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EditGroup } from "@screens/EditGroup";
import { Groups } from "@screens/Groups";
import { NewGroup } from "@screens/NewGroup";
import { Players } from "@screens/Players";

const {Navigator, Screen} = createNativeStackNavigator();

export function AppRoutes(){
  return(
    <Navigator screenOptions={{headerShown: false}}>

      <Screen 
        name="groups"
        component={Groups}
      />

      <Screen 
        name="new"
        component={NewGroup}
      />

      <Screen 
        name="edit"
        component={EditGroup}
      />

      <Screen 
        name="players"
        component={Players}
      />

    </Navigator>
  )
}