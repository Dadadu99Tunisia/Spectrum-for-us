export interface Address {
  id: string;
  user_id?: string;
  label: string | null;
  full_name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  zip: string;
  country: string;
  is_default: boolean;
  created_at?: string;
}

export const EMPTY_ADDRESS: Omit<Address, "id"> = {
  label: "", full_name: "", phone: "", line1: "", line2: "",
  city: "", zip: "", country: "FR", is_default: false,
};
