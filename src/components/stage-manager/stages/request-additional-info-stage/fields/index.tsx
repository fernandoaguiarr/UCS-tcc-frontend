
import { MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, RadioGroup, FormLabel, FormControlLabel, Radio, FormGroup, Checkbox, TextField } from "@mui/material";
import React, { PropsWithChildren, } from "react"

const _Input: React.FC<PropsWithChildren<{ field: any, value: any, setValue: any, index: number }>> = ({ field, value, setValue, index }) => {
    const { attributes } = field;
    const id: string = attributes?.id || `field_${index}`;
    const label: string = attributes?.label || `Campo ${index + 1}`;

    return (
        <TextField
            id={id}
            label={label}
            variant="outlined"
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
        />
    )
}

const _Select: React.FC<PropsWithChildren<{ field: any, value: any, setValue: any, index: number }>> = ({ field, value, setValue, index }) => {
    const { attributes, options } = field;

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
    };

    const id: string = attributes?.id || `field_${index}`;
    const labelId: string = `${id}_label`;
    const label: string = attributes?.label || `Campo ${index + 1}`;
    const multiple: boolean = attributes?.multiple || field?.field_type == "multiselect"

    return (
        <FormControl fullWidth>
            <InputLabel id={labelId}>
                {label}
            </InputLabel>
            <Select
                id={id}
                labelId={labelId}
                label={label}
                name={attributes?.name || `field_${index}`}
                value={value}
                onChange={handleChange}
                multiple={multiple}
            >
                {
                    options?.map((option: any, index_option: number) =>
                        <MenuItem
                            key={index_option}
                            value={option?.value || option?.label}
                        >
                            {option?.label}
                        </MenuItem>
                    )
                }
            </Select>
        </FormControl>
    )
}

const _Radio: React.FC<PropsWithChildren<{ field: any, value: any, setValue: any, index: number }>> = ({ field, value, setValue, index }) => {
    const { attributes, options } = field;

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
    };

    const id: string = attributes?.id || `field_${index}`;
    const labelId: string = `${id}_label`;
    const label: string = attributes?.label || `Campo ${index + 1}`;

    if (options?.length) {
        return (
            <FormControl fullWidth>
                <FormLabel id={labelId}>{label}</FormLabel>
                <RadioGroup
                    id={id}
                    aria-labelledby={labelId}
                    name={attributes?.name || `field_${index}`}
                    value={value}
                    onChange={handleChange}
                    {...field}
                >
                    {
                        options?.map((option: any, index_option: number) =>
                            <FormControlLabel
                                key={index_option}
                                value={option?.value || option?.label}
                                control={<Radio />}
                                label={option?.label}
                            />
                        )
                    }
                </RadioGroup>
            </FormControl>
        )
    }

    return (
        <FormControl fullWidth>
            <FormLabel id={labelId}>{label}</FormLabel>
            <Radio
                id={id}
                checked={value === (attributes?.value || attributes?.label)}
                onChange={handleChange}
                value={attributes?.value || attributes?.label}
                name={attributes?.name || `field_${index}`}
                aria-labelledby={labelId}
                {...field}
            />
        </FormControl>
    )
}

const _Checkbox: React.FC<PropsWithChildren<{ field: any, value: any, setValue: any, index: number }>> = ({ field, value, setValue, index }) => {
    const { attributes } = field;

    setValue(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.checked);
    };

    const id: string = attributes?.id || `field_${index}`;
    const label: string = attributes?.label || `Campo ${index + 1}`;


    return (
        <FormGroup>
            <FormControlLabel
                label={label}
                control={
                    <Checkbox
                        id={id}
                        checked={value}
                        onChange={handleChange}
                    />
                }
            />
        </FormGroup>
    )
}

const Field: React.FC<PropsWithChildren<{ field: any, value: any, setValue: any, index: number }>> = ({ field, value, setValue, index }) => {
    const fields: any = {
        "select": <_Select field={field} value={value} setValue={setValue} index={index} />,
        "multiselect": <_Select field={field} value={value} setValue={setValue} index={index} />,
        "input-radio": <_Radio field={field} value={value} setValue={setValue} index={index} />,
        "input-checkbox": <_Checkbox field={field} value={value} setValue={setValue} index={index} />
    }

    return fields[field["field_type"]]
}

export const Fields: React.FC<PropsWithChildren<{ fields: any[] }>> = ({ fields }) => {

    return <>
        {
            fields?.map((field, index: number) =>
                <Field
                    key={index}
                    index={index}
                    field={field?.field}
                    value={field?.state[0]}
                    setValue={field?.state[1]}
                />
            )
        }
    </>
}