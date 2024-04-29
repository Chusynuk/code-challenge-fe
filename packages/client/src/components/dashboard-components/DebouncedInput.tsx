import { useEffect, useState } from 'react';

const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
    const [inputValue, setInputValue] = useState(initialValue);

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(inputValue);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [inputValue]);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(event.target.value);

    return (
        <input
            type="text"
            {...props}
            value={inputValue}
            onChange={handleOnChange}
        />
    );
};

export { DebouncedInput };
