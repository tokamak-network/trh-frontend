import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Info, Eye, EyeOff, Loader, AlertCircle } from "lucide-react";
import {
  Account,
  validateSeedPhrase,
  generateAccountsFromSeedPhrase,
  ValidationResult,
} from "@/lib/utils/wallet";

export function AccountsStep() {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: false,
  });
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setValue, watch, getValues } = useFormContext();

  const selectedAccounts = {
    admin: watch("adminAccount"),
    proposer: watch("proposerAccount"),
    batcher: watch("batcherAccount"),
    sequencer: watch("sequencerAccount"),
  };

  const l1RpcUrl = watch("l1RpcUrl");

  // Initialize from existing form values
  useEffect(() => {
    const initializeFromForm = async () => {
      // If we have any account set, we need to regenerate the accounts list
      const adminAccount = getValues("adminAccount");
      const adminPrivateKey = getValues("adminPrivateKey");

      if (adminAccount && adminPrivateKey) {
        // We have existing accounts, let's regenerate the seed phrase
        const storedSeedPhrase = getValues("seedPhrase");
        if (storedSeedPhrase) {
          setSeedPhrase(storedSeedPhrase);
          // This will trigger the other useEffect to regenerate accounts
        }
      }
    };

    initializeFromForm();
  }, []);

  useEffect(() => {
    const result = validateSeedPhrase(seedPhrase);
    setValidation(result);

    if (result.isValid && l1RpcUrl) {
      generateAccounts();
    }
  }, [seedPhrase]);

  const handleSeedPhraseChange = (index: number, value: string) => {
    const words = seedPhrase.trim().split(/\s+/);
    words[index] = value.trim().toLowerCase();
    const newSeedPhrase = words.join(" ");
    setSeedPhrase(newSeedPhrase);
    // Store seed phrase in form data
    setValue("seedPhrase", newSeedPhrase);
  };

  const generateAccounts = async () => {
    try {
      setIsLoading(true);

      if (!l1RpcUrl) {
        setValidation({
          isValid: false,
          message:
            "Please configure L1 RPC URL in the Configuration step first",
        });
        return;
      }

      const newAccounts = await generateAccountsFromSeedPhrase(
        seedPhrase,
        l1RpcUrl
      );
      setAccounts(newAccounts);

      // Restore previously selected accounts if they exist in the new accounts list
      Object.entries(selectedAccounts).forEach(([role, address]) => {
        if (address && newAccounts.some((acc) => acc.address === address)) {
          const account = newAccounts.find((acc) => acc.address === address);
          if (account) {
            setValue(role + "Account", account.address);
            setValue(role + "PrivateKey", account.privateKey);
          }
        }
      });
    } catch (err) {
      console.error("Error generating accounts:", err);
      setValidation({
        isValid: false,
        message:
          "Failed to generate accounts. Please ensure your seed phrase is valid.",
      });
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = (
    address: string,
    role: keyof typeof selectedAccounts
  ) => {
    // Find the selected account
    const selectedAccount = accounts.find((acc) => acc.address === address);
    if (selectedAccount) {
      // Store both address and private key
      setValue(role + "Account", address);
      setValue(role + "PrivateKey", selectedAccount.privateKey);
    }
  };

  const renderAccountSelector = (
    role: string,
    accountType: keyof typeof selectedAccounts
  ) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {role} Account
        <span className="text-red-500 ml-1">*</span>
      </label>
      <select
        value={selectedAccounts[accountType] || ""}
        onChange={(e) => handleAccountSelect(e.target.value, accountType)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Select an account</option>
        {accounts.map((account, index) => (
          <option key={account.address} value={account.address}>
            Account {index + 1}: {account.address} ({account.balance || "0"}{" "}
            ETH)
          </option>
        ))}
      </select>
    </div>
  );

  const renderSeedPhraseInputs = () => {
    const words = seedPhrase.split(/\s+/);
    return (
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="relative">
            <input
              type={showSeedPhrase ? "text" : "password"}
              value={words[index] || ""}
              onChange={(e) => handleSeedPhraseChange(index, e.target.value)}
              placeholder={`Word ${index + 1}`}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                !validation.isValid && words[index]
                  ? "border-yellow-400 bg-yellow-50"
                  : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Account Configuration</h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Seed Phrase
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400" />
              <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                Enter your MetaMask seed phrase (12 words). Make sure all words
                are valid BIP39 words.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
            )}
            <button
              type="button"
              onClick={() => setShowSeedPhrase(!showSeedPhrase)}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showSeedPhrase ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {renderSeedPhraseInputs()}

        {!validation.isValid && validation.message && (
          <div className="mt-2 flex items-start gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>{validation.message}</p>
              {validation.message.includes("BIP39") && (
                <p className="mt-1">
                  Each word must be from the standard BIP39 word list. Check for
                  typos or incorrect words.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {accounts.length > 0 && validation.isValid && (
        <div className="space-y-6">
          {renderAccountSelector("Admin", "admin")}
          {renderAccountSelector("Proposer", "proposer")}
          {renderAccountSelector("Batcher", "batcher")}
          {renderAccountSelector("Sequencer", "sequencer")}

          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              Make sure to save these account details securely. You will need
              them to manage your L2 chain.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
