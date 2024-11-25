import Paper from '@mui/material/Paper';
import { TileContents } from "../base/TileContents";
import "./QueryContents.css";
import Table from '@mui/material/Table/Table';
import TableContainer from '@mui/material/TableContainer/TableContainer';
import TableHead from '@mui/material/TableHead/TableHead';
import TableRow from '@mui/material/TableRow/TableRow';
import TableCell from '@mui/material/TableCell/TableCell';
import TableBody from '@mui/material/TableBody/TableBody';
import { query } from '../../services/MonitorService';
import { QueryContent } from '../../../interfaces/content/QueryContent';
import { IQueryResponse } from '../../../interfaces/IQueryResponse';

export class QueryContents extends TileContents<QueryContent, {data?: IQueryResponse}> {

    private queryData: () => Promise<IQueryResponse>;
    
    constructor(props: {content: QueryContent}) {
        super(props);
        this.queryData = () => query(props.content.query);
        this.state = {data: undefined};
    }

    render() {
        if (!this.state.data) {
            this.queryData().then((data) => {
                this.setState({data: data});
            });
        }

        const columns = this.state.data?.tables[0].columns;
        const rows = this.state.data?.tables[0].rows;

        return (
            <TableContainer className='table' component={Paper}>
                <Table aria-label="simple table" size='small'>
                    <TableHead>
                        <TableRow sx={{
                            lineHeight: '35px', 
                            height: 35, 
                            textWrap: 'nowrap'
                        }}>
                            {columns?.map((column) => (
                                <TableCell
                                    key={column.name}
                                >
                                    {column.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row) => (
                            <TableRow
                                sx={{
                                    textWrap: 'nowrap'
                                }}
                            >
                                {row.map((element) => (
                                    <TableCell>
                                        {element}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}