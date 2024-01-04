import {FlatList} from "react-native";
import ExpenseItem from "./ExpenseItem";


const ExpensesList = ({expenses}) => {

    const renderExpenseItem = (itemData) => {


        return <ExpenseItem {...itemData.item}/>
    }

    return <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
    />
}

export default ExpensesList;

