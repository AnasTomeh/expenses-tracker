import {View, StyleSheet} from "react-native";
import {useContext, useLayoutEffect, useState} from "react";
import {IconButton} from "../components/UI/IconButton";
import {GlobalStyles} from "../constants/styles";
import {ExpensesContext} from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpenses/ExpenseForm";
import {deleteExpense, storeExpense, updateExpense} from "../utilty/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";


const ManageExpense = ({route, navigation}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const expensesCtx = useContext(ExpensesContext);

    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId;

    const selectedExpense = expensesCtx.expenses.find(expense => expense.id === editedExpenseId);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense'
        })
    }, [navigation, isEditing])

    const deleteExpenseHandler = async () => {

        setIsSubmitting(true)
        try {

            expensesCtx.deleteExpense(editedExpenseId);
            await deleteExpense(editedExpenseId)
            navigation.goBack();

        } catch (error) {
            setError("Could not delete expense - please try again later!");
            setIsSubmitting(false)
        }


    }
    const cancelHandler = () => {
        navigation.goBack();
    }

    const confirmHandler = async (expenseData) => {

        setIsSubmitting(true)

        try {

            if (isEditing) {
                expensesCtx.updateExpense(editedExpenseId, expenseData);
                await updateExpense(editedExpenseId, expenseData)
            }
            else {
                const id = await storeExpense(expenseData)
                expensesCtx.addExpense({...expenseData, id})
            }

            navigation.goBack();

        } catch (error) {
            setError("Could not save data - please try again later");
            setIsSubmitting(false)
        }

    }

    const errorHandler = () => {
        setError(null)
    }

    if (error && !isSubmitting) {

        return <ErrorOverlay message={error} onConfirm={errorHandler}/>
    }

    if (isSubmitting) {
        return  <LoadingOverlay />
    }

    return (
        <View style={styles.container}>
            <ExpenseForm
                submitButtonLabel={isEditing ? "Update" : "Add"}
                onSubmit={confirmHandler}
                onCancel={cancelHandler}
                defaultValues={selectedExpense}
            />

            {isEditing &&
                <View style={styles.deleteContainer}>
                    {isEditing && <IconButton
                        icon={"trash"}
                        color={GlobalStyles.colors.error500}
                        size={36}
                        onPress={deleteExpenseHandler}
                    />
                    }
                </View>
            }
        </View>
    )
}


export default ManageExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center'
    },

})