import {View, StyleSheet, Text} from "react-native";
import Input from "./Input";
import {useState} from "react";
import Button from "../UI/Button";
import {GlobalStyles} from "../../constants/styles";


const ExpenseForm = (props) => {

    const {onCancel, onSubmit, submitButtonLabel, defaultValues} = props
    const [inputs, setInputs] = useState({
        amount: {
            value: defaultValues ? defaultValues.amount.toString() : '',
            isValid: true,
        },
        date: {
            value: defaultValues ? defaultValues.date.toISOString().slice(0, 10) : '',
            isValid: true,
        },
        description: {
            value: defaultValues ? defaultValues.description : '',
            isValid: true
        }
    });

    const inputChangeHandler = (inputIdentifier,enteredValue) => {
        setInputs((currentInput) => {
            return {
                ...currentInput,
                [inputIdentifier] : {value: enteredValue, isValid: true}
            }
        })
    };


    const submitHandler = () => {

        const expenseData = {
            amount: +inputs.amount.value,
            date: new Date(inputs.date.value),
            description: inputs.description.value
        };

        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
        const dataIsValid =  expenseData.date.toString() !== 'Invalid Date';
        const descriptionIsValid = expenseData.description.trim().length > 0;

        if (!amountIsValid || !dataIsValid || !descriptionIsValid) {

            // Alert.alert("Invalid input, Please check your input values");

            setInputs((curInputs) => {

                return {
                    amount: {value: curInputs.amount.value, isValid: amountIsValid},
                    date: {value: curInputs.date.value, isValid: dataIsValid},
                    description: {value: curInputs.description.value, isValid: descriptionIsValid},
                }
            })
            return
        }

        onSubmit(expenseData)
    }

    const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Your Expense</Text>
            <View style={styles.inputsRow}>
                <Input
                    style={styles.rowInput}
                    label={"Amount"}
                    invalid={!inputs.amount.isValid}
                    textInputConfig={{
                        keyboardType: 'decimal-pad',
                        onChangeText: inputChangeHandler.bind(this, 'amount'),
                        value: inputs.amount.value
                    }}
                />
                <Input
                    style={styles.rowInput}
                    label={"Date"}
                    invalid={!inputs.date.isValid}
                    textInputConfig={{
                        placeholder: "YYYY-MM-DD",
                        maxLength: 10,
                        onChangeText: inputChangeHandler.bind(this, 'date'),
                        value: inputs.date.value
                    }}
                />
            </View>

            <Input
                label={"Description"}
                invalid={!inputs.description.isValid}
                textInputConfig={{
                    multiline: true,
                    // autoCapitalize: 'none',
                    // autoCorrect: false,
                    onChangeText: inputChangeHandler.bind(this, 'description'),
                    value: inputs.description.value
                }}
            />
            {formIsInvalid && <Text style={styles.errorText}>Invalid input values - Please check your entered data!</Text>}
            <View style={styles.buttons}>
                <Button style={styles.button} mode="flat" onPress={onCancel}>Cancel</Button>
                <Button style={styles.button} onPress={submitHandler}>{submitButtonLabel} </Button>
            </View>
        </View>
    )
};

export default ExpenseForm;

const styles = StyleSheet.create({
    form: {
        marginTop: 40
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 24,
        textAlign: 'center'
    },
    inputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowInput: {
        flex: 1
    },
    errorText: {
        textAlign: 'center',
        color: GlobalStyles.colors.error500,
        margin: 8
    },
    buttons: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8
    },

})