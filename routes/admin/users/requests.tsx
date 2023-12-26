import { useSignal } from "@preact/signals";

import { UserRequestType } from "@models/User.ts";

// import AcceptingForm from "@components/User/Requests/AcceptingForm.tsx";
// import UserRequest from "@components/User/Requests/UserRequest.tsx";

export default function Requests() {
  const requests = useSignal<UserRequestType[]>([]);
  const selectedRequest = useSignal<number>(0);
  const request = useSignal<UserRequestType>({email: "", note: ""});

  return (
    <div>
      <UserRequest requests={requests} selectedRequest={selectedRequest} />
      <AcceptingForm request={request} />
    </div>
  );
}
