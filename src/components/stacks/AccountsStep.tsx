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
    const initializeFromForm = () => {
      const storedSeedPhrase = getValues("seedPhrase");
      if (storedSeedPhrase) {
        setSeedPhrase(storedSeedPhrase);
        const result = validateSeedPhrase(storedSeedPhrase);
        setValidation(result);
      }
    };

    initializeFromForm();
  }, [getValues]);

  // Add new effect to validate seed phrase when it changes
  useEffect(() => {
    if (seedPhrase.trim()) {
      const result = validateSeedPhrase(seedPhrase.trim());
      setValidation(result);
    }
  }, [seedPhrase]);

  useEffect(() => {
    const generateAccountsIfValid = async () => {
      if (validation.isValid && l1RpcUrl && seedPhrase) {
        try {
          setIsLoading(true);
          const newAccounts = await generateAccountsFromSeedPhrase(
            seedPhrase.trim(),
            l1RpcUrl
          );
          setAccounts(newAccounts);
        } catch (err) {
          console.error("Error generating accounts:", err);
          setValidation({
            isValid: false,
            message:
              "Failed to generate accounts. Please check your L1 RPC URL.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateAccountsIfValid();
  }, [validation.isValid, l1RpcUrl, seedPhrase]);

  const handleSeedPhraseChange = (index: number, value: string) => {
    const words = seedPhrase.trim().split(/\s+/);
    words[index] = value.trim().toLowerCase();
    const newSeedPhrase = words.join(" ").trim();
    setSeedPhrase(newSeedPhrase);
    // Store seed phrase in form data for persistence
    setValue("seedPhrase", newSeedPhrase, { shouldValidate: false });
  };

  const handleAccountSelect = (
    account: Account,
    role: keyof typeof selectedAccounts
  ) => {
    // Store both address and private key
    setValue(role + "Account", account.address);
    // Store private key in a hidden form field
    setValue(role + "PrivateKey", account.privateKey, {
      shouldValidate: false,
    });
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
        onChange={(e) => {
          const account = accounts.find(
            (acc) => acc.address === e.target.value
          );
          if (account) {
            handleAccountSelect(account, accountType);
          }
        }}
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
    const words = seedPhrase.trim().split(/\s+/);
    return (
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="relative">
            <input
              type={showSeedPhrase ? "text" : "password"}
              value={words[index] || ""}
              onChange={(e) => handleSeedPhraseChange(index, e.target.value)}
              onBlur={() => {
                if (seedPhrase.trim()) {
                  const result = validateSeedPhrase(seedPhrase.trim());
                  setValidation(result);
                }
              }}
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
      <h2 className="text-xl font-semibold mb-6">Account Selection</h2>
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
        <p className="text-blue-800 text-sm">
          Enter your seed phrase to generate accounts. Select different accounts
          for each role. Each account should have sufficient ETH balance for
          their respective operations.
        </p>
      </div>

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

          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-800">
              Make sure each selected account has sufficient ETH balance for
              their operations. The accounts will be used to sign transactions
              for their respective roles.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
