import type { Column } from '@tanstack/react-table'
import { DebouncedInput } from '.'

const Filter = ({ column }: { column: Column<any, unknown> }) => {
    const columnFilterValue = column.getFilterValue()

    const handleOnFilter = (value: string | number) => {
        column.setFilterValue(value)
    }
    return (
        <DebouncedInput
            onChange={handleOnFilter}
            placeholder={'Search status...'}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
    )
}

export { Filter }
