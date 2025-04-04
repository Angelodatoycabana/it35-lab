import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqjqlzdeouujrscjdipu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxanFsemRlb3V1anJzY2pkaXB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzcyNzIwMCwiZXhwIjoyMDU5MzAzMjAwfQ.4rF2KkTYkOQSvcXMIgUpvBU4G6j6fwZ6AHsnJR62qFM';

export const supabase = createClient(supabaseUrl, supabaseKey);