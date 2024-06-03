import {
    TextField,
    InputLabel, Select, MenuItem,
    Autocomplete,
    FormControlLabel, Switch, Checkbox,
    FormHelperText, FormControl, FormLabel,
    Tooltip,
    Button
} from "@mui/material"
import {useController, Controller} from "react-hook-form"


export const ControlledTextField = ({control, name, ...props}) => {
    const {
        field,
        fieldState: {error},
    } = useController({
        name,
        control,
        rules: {required: true},
    })


    return (
        <FormControl component={"fieldset"} variant={"standard"} fullWidth>
            {
                props?.helperText ?
                    <Tooltip title={props?.helperText}>
                        <FormLabel component={"legend"}>{props?.label}</FormLabel>
                    </Tooltip> :
                    <FormLabel component={"legend"}>{props?.label}</FormLabel>
            }

            <TextField
                {...props}
                fullWidth
                onChange={field.onChange} // send value to hook form
                onBlur={field.onBlur} // notify when input is touched/blur
                value={field.value} // input value
                name={field.name} // send down the input name
                inputRef={field.ref} // send input ref, so we can focus on input when error appear
                error={!!error}
                helperText={error?.message}
                label={undefined}
            />
        </FormControl>
    )
}

export const ControlledSelect = ({control, name, options, ...props}) => {
    const {
        field,
    } = useController({
        name,
        control,
        rules: {required: true},
    })
    return (
        <>
            {props?.label && <InputLabel id={`select-label-${name}`}>{props?.label}</InputLabel>}
            <Select
                labelId={`select-label-${name}`}
                value={field.value}
                label={props?.label}
                onChange={field.onChange}
            >
                {options.map(({label, value}) => (
                    <MenuItem value={value}>{label}</MenuItem>
                ))}
            </Select>
        </>
    )
}

export const ControlledAutocomplete = ({control, name, options, ...props}) => {
    return (
        <>
            <Controller
                render={({field}) => {
                    const {onChange, onBlur, value} = field;
                    return (<>
                        <FormControl component={"fieldset"} variant={"standard"} fullWidth>
                            <FormLabel component={"legend"}>{props?.label}</FormLabel>
                            <Autocomplete
                                fullWidth
                                options={options}
                                isOptionEqualToValue={(option, value) => (option?.value === value || option?.value === value?.value)}
                                getOptionLabel={option => option?.label}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        // label={props?.label}
                                    />
                                )}
                                onChange={(e, data) => onChange(data)}
                                onBlur={onBlur}
                                value={value}
                                className={props?.className}
                            />
                        </FormControl>
                    </>);
                }}
                onChange={([_, data]) => data}
                name={name}
                control={control}
            />
        </>
    )
}

export const ControlledSwitch = ({control, name, ...props}) => {
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({field: {onChange, value}}) => (
                    <FormControlLabel
                        control={<Switch checked={value} onChange={onChange}/>}
                        label={props?.label}
                    />
                )}
            />
        </>
    )
}

export const ControlledCheckbox = ({control, name, ...props}) => {
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({field: {onChange, value}}) => (
                    <FormControlLabel
                        control={<Checkbox checked={value} onChange={onChange}/>}
                        label={props?.label}
                    />
                )}
            />
            {props?.helperText && <FormHelperText>{props?.helperText}</FormHelperText>}
        </>
    )
}

export const ControlledToggle = ({control, name, ...props}) => {
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({field: {onChange, value}}) => props?.helperText ? (
                    <Tooltip title={props?.helperText} disableFocusListener>
                        <Button className={props?.className} variant={value ? "contained" : "outlined"} onClick={() => onChange(!value)}>
                            {props?.label}
                        </Button>
                    </Tooltip>
                ) : (
                    <Button className={props?.className} variant={value ? "contained" : "outlined"} onClick={() => onChange(!value)}>
                        {props?.label}
                    </Button>
                )}
            />
        </>
    )
}
