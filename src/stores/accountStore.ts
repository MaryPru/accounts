import { defineStore } from 'pinia';
import {ref, watch} from 'vue';
import type { Account } from '../types/account';

export const useAccountStore = defineStore('account', () => {
    const accounts = ref<Account[]>(loadAccounts());

    function addAccount(account: Account) {
        accounts.value.push({ ...account });
    }

    function removeAccount(id: string) {
        accounts.value = accounts.value.filter(acc => acc.id !== id);
    }

    function updateAccount(updated: Account) {
        const isValidLogin = !!updated.login?.trim();
        const isValidPassword = updated.type !== 'Локальная' || !!updated.password?.trim();

        const index = accounts.value.findIndex(acc => acc.id === updated.id);
        if (index === -1) return;

        const updatedAccount = { ...updated, isValid: isValidLogin && isValidPassword };
        accounts.value[index] = updatedAccount;
    }

    watch(accounts, () => {
        const validAccounts = accounts.value.filter(a => a.isValid);
        localStorage.setItem('accounts', JSON.stringify(validAccounts));
    }, { deep: true });

    function loadAccounts(): Account[] {
        const raw = localStorage.getItem('accounts');
        return raw ? JSON.parse(raw) : [];
    }

    return {
        accounts,
        addAccount,
        removeAccount,
        updateAccount,
    };
});
