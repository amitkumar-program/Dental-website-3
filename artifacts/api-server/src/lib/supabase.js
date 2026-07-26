import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim();
let supabaseClient;
try {
    if (!supabaseUrl)
        throw new Error('SUPABASE_URL is missing or empty.');
    if (!supabaseServiceKey)
        throw new Error('SUPABASE_SERVICE_ROLE_KEY and SUPABASE_ANON_KEY are missing.');
    if (!/^https?:\/\//i.test(supabaseUrl))
        throw new Error('Invalid URL');
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
catch (e) {
    console.warn('[AI Studio] Supabase not configured — using mock');
    const mockDb = {
        profiles: [
            { id: 'mock-admin-id_admin:true', is_admin: true, created_at: new Date().toISOString() },
            { id: 'mock-patient-id_admin:false', is_admin: false, created_at: new Date().toISOString() },
            { id: 'mock-owner-id_admin:true', is_admin: true, created_at: new Date().toISOString() }
        ],
        appointments: [
            {
                id: 1,
                service: 'Routine Dental Cleanings',
                preferred_date: '2026-08-05',
                status: 'confirmed',
                name: 'Elena Rostova',
                email: 'patient@example.com',
                phone: '123-456-7890',
                message: 'Looking forward to my checkup!',
                created_at: new Date().toISOString(),
                user_id: 'mock-patient-id_admin:false'
            }
        ],
        wellness_subscriptions: [],
        patient_forms: []
    };
    class MockQueryBuilder {
        table;
        operation = 'select';
        conditions = [];
        orderField = null;
        orderAscending = true;
        dataToInsertOrUpdate = null;
        constructor(table) {
            this.table = table;
            if (!mockDb[table]) {
                mockDb[table] = [];
            }
        }
        insert(data) {
            this.operation = 'insert';
            this.dataToInsertOrUpdate = data;
            return this;
        }
        update(data) {
            this.operation = 'update';
            this.dataToInsertOrUpdate = data;
            return this;
        }
        delete() {
            this.operation = 'delete';
            return this;
        }
        select(_columns = '*') {
            return this;
        }
        eq(field, value) {
            this.conditions.push({ field, value });
            return this;
        }
        order(field, options) {
            this.orderField = field;
            this.orderAscending = options?.ascending ?? true;
            return this;
        }
        async then(onfulfilled) {
            try {
                const res = await this.execute();
                return onfulfilled(res);
            }
            catch (err) {
                console.error(err);
                return onfulfilled({ data: null, error: err });
            }
        }
        async single() {
            const { data, error } = await this.execute();
            if (error)
                return { data: null, error };
            const singleData = Array.isArray(data) ? (data[0] ?? null) : data;
            return { data: singleData, error: null };
        }
        async execute() {
            const list = mockDb[this.table] || [];
            if (this.operation === 'insert') {
                const recordsToInsert = Array.isArray(this.dataToInsertOrUpdate)
                    ? this.dataToInsertOrUpdate
                    : [this.dataToInsertOrUpdate];
                const inserted = [];
                for (const rec of recordsToInsert) {
                    const newRec = {
                        id: Math.floor(1000 + Math.random() * 9000),
                        created_at: new Date().toISOString(),
                        status: 'pending',
                        ...rec
                    };
                    list.push(newRec);
                    inserted.push(newRec);
                }
                return { data: Array.isArray(this.dataToInsertOrUpdate) ? inserted : inserted[0], error: null };
            }
            if (this.operation === 'update') {
                const filtered = list.filter(item => {
                    return this.conditions.every(cond => String(item[cond.field]) === String(cond.value));
                });
                for (const item of filtered) {
                    Object.assign(item, this.dataToInsertOrUpdate);
                }
                return { data: filtered, error: null };
            }
            if (this.operation === 'delete') {
                const beforeLength = list.length;
                mockDb[this.table] = list.filter(item => {
                    return !this.conditions.every(cond => String(item[cond.field]) === String(cond.value));
                });
                return { data: { count: beforeLength - mockDb[this.table].length }, error: null };
            }
            // Default: select
            let filtered = [...list];
            if (this.conditions.length > 0) {
                filtered = filtered.filter(item => {
                    return this.conditions.every(cond => String(item[cond.field]) === String(cond.value));
                });
            }
            if (this.table === 'profiles' && filtered.length === 0 && this.conditions.some(c => c.field === 'id')) {
                const idCond = this.conditions.find(c => c.field === 'id');
                if (idCond) {
                    const val = idCond.value;
                    const isAdmin = typeof val === 'string' && val.includes('admin:true');
                    const newProfile = {
                        id: val,
                        is_admin: isAdmin,
                        created_at: new Date().toISOString()
                    };
                    list.push(newProfile);
                    filtered = [newProfile];
                }
            }
            if (this.orderField) {
                filtered.sort((a, b) => {
                    const valA = a[this.orderField];
                    const valB = b[this.orderField];
                    if (valA === valB)
                        return 0;
                    if (valA == null)
                        return 1;
                    if (valB == null)
                        return -1;
                    const cmp = valA < valB ? -1 : 1;
                    return this.orderAscending ? cmp : -cmp;
                });
            }
            return { data: filtered, error: null };
        }
    }
    supabaseClient = {
        auth: {
            admin: {
                listUsers: async () => {
                    return {
                        data: {
                            users: [
                                { id: 'mock-admin-id_admin:true', email: 'admin@brightline.com' },
                                { id: 'mock-patient-id_admin:false', email: 'patient@example.com' },
                                { id: 'mock-owner-id_admin:true', email: 'enginebuild.io@gmail.com' }
                            ]
                        },
                        error: null
                    };
                }
            },
            getUser: async (token) => {
                if (token && token.startsWith('mockjwt_')) {
                    try {
                        const jsonStr = decodeURIComponent(token.slice('mockjwt_'.length));
                        const payload = JSON.parse(jsonStr);
                        return {
                            data: {
                                user: {
                                    id: payload.id,
                                    email: payload.email,
                                }
                            },
                            error: null
                        };
                    }
                    catch (err) {
                        return { data: { user: null }, error: { message: 'Invalid mock token' } };
                    }
                }
                return { data: { user: null }, error: { message: 'Not authenticated' } };
            }
        },
        from: (table) => {
            return new MockQueryBuilder(table);
        }
    };
}
export const supabase = supabaseClient;
