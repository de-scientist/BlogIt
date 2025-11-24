import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';


async function fetchProfile() {
const { data } = await api.get('/auth/me');
return data;
}


export default function ProfileView() {
const { data } = useQuery(['me'], fetchProfile);


return (
<div>
<h2>Profile</h2>
<pre>{JSON.stringify(data, null, 2)}</pre>
</div>
);
}