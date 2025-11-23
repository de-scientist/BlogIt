import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';


async function fetchTrash() {
const { data } = await api.get('/blogs/trash');
return data;
}


export default function Trash() {
const { data } = useQuery(['trash'], fetchTrash);


const recover = async (id: string) => {
await api.post(`/blogs/recover/${id}`);
};


return (
<div>
<h2>Trash</h2>
{data?.map((b: any) => (
<div key={b.id} className="p-3 border">
<h4>{b.title}</h4>
<button onClick={() => recover(b.id)}>Recover</button>
</div>
))}
</div>
);
}