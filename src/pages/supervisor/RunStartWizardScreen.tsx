import { useState } from "react";
import { Check, X, AlertTriangle, ChevronRight, ChevronLeft, Fingerprint, Loader2, Package, ShieldCheck, Droplets, Bug, Users, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  wizardProducts,
  labelValidation,
  cipVerification,
  allergenCheck,
  bomItems,
  assignableOperators,
  type WizardProduct,
} from "@/data/supervisorMockData";

const steps = [
  { id: 'product', label: 'Product & Line', icon: Package },
  { id: 'label', label: 'Label Check', icon: ShieldCheck },
  { id: 'cip', label: 'CIP Verify', icon: Droplets },
  { id: 'allergen', label: 'Allergen', icon: Bug },
  { id: 'bom', label: 'BOM Check', icon: Package },
  { id: 'operators', label: 'Operators', icon: Users },
  { id: 'confirm', label: 'Confirm', icon: Rocket },
];

export default function RunStartWizardScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<WizardProduct | null>(null);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedProduct;
      case 1: return labelValidation.status === 'PASSED';
      case 2: return cipVerification.status !== 'REQUIRED';
      case 3: return allergenCheck.cleanDownStatus !== 'PENDING';
      case 4: return !bomItems.some(b => b.status === 'ON-HOLD' || b.status === 'INSUFFICIENT');
      case 5: return selectedOperators.length >= 2;
      default: return true;
    }
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      toast.success(`Run started: ${selectedProduct?.name} on ${selectedProduct?.line}`);
      setCurrentStep(0);
      setSelectedProduct(null);
      setSelectedOperators([]);
    }, 2000);
  };

  const toggleOperator = (id: string) => {
    setSelectedOperators(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
  };

  const statusIcon = (status: string) => {
    if (status === 'PASSED' || status === 'VERIFIED' || status === 'COMPLETED' || status === 'AVAILABLE')
      return <Check className="h-5 w-5 text-status-running" />;
    if (status === 'FAILED' || status === 'REQUIRED' || status === 'INSUFFICIENT' || status === 'ON-HOLD')
      return <X className="h-5 w-5 text-status-critical" />;
    return <AlertTriangle className="h-5 w-5 text-status-warning" />;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Run Start Wizard</h1>

      {/* Step indicator */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const StepIcon = step.icon;
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium whitespace-nowrap transition-colors",
                i === currentStep ? "bg-primary text-primary-foreground" :
                i < currentStep ? "bg-status-running/20 text-status-running" :
                "bg-muted text-muted-foreground"
              )}
            >
              <StepIcon className="h-3 w-3" />
              {step.label}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="data-card p-4 min-h-[400px]">
        {/* Step 0: Product selection */}
        {currentStep === 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Select Product & Line</h2>
            <p className="text-sm text-muted-foreground">Choose from today's dispatch board</p>
            <div className="space-y-2 mt-4">
              {wizardProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left transition-all",
                    selectedProduct?.id === product.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.line}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <div><span className="block text-foreground font-mono">{product.sku}</span>SKU</div>
                    <div><span className="block text-foreground font-mono">{product.targetQuantity.toLocaleString()}</span>Target</div>
                    <div><span className="block text-foreground font-mono">{product.recipeVersion}</span>Recipe</div>
                    <div><span className="block text-foreground font-mono">{product.estimatedDuration}</span>Duration</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Label validation */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Label Validation</h2>
            <div className={cn(
              "flex items-center gap-4 rounded-lg border p-4",
              labelValidation.status === 'PASSED' ? "border-status-running bg-status-running/10" :
              labelValidation.status === 'FAILED' ? "border-status-critical bg-status-critical/10" :
              "border-status-warning bg-status-warning/10"
            )}>
              {statusIcon(labelValidation.status)}
              <div>
                <p className="font-semibold text-foreground">{labelValidation.status}</p>
                <p className="text-sm text-muted-foreground">
                  {labelValidation.status === 'PASSED' ? 'All label elements verified — allergens, nutrition, barcode match product master' :
                   labelValidation.details || 'Validation in progress...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: CIP verification */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">CIP Verification</h2>
            <div className={cn(
              "flex items-center gap-4 rounded-lg border p-4",
              cipVerification.status === 'VERIFIED' ? "border-status-running bg-status-running/10" :
              cipVerification.status === 'REQUIRED' ? "border-status-critical bg-status-critical/10" :
              "border-muted bg-muted"
            )}>
              {statusIcon(cipVerification.status)}
              <div>
                <p className="font-semibold text-foreground">{cipVerification.status}</p>
                {cipVerification.lastCycleDate && (
                  <p className="text-sm text-muted-foreground">
                    Last cycle: {cipVerification.lastCycleDate} — {cipVerification.lastCycleType}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Allergen check */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Allergen Risk Assessment</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="data-card p-3 text-center">
                <p className="metric-label">Risk Level</p>
                <p className={cn("font-mono text-xl font-bold mt-1",
                  allergenCheck.riskLevel === 'LOW' ? 'text-status-running' :
                  allergenCheck.riskLevel === 'MEDIUM' ? 'text-status-warning' :
                  'text-status-critical'
                )}>{allergenCheck.riskLevel}</p>
              </div>
              <div className="data-card p-3 text-center">
                <p className="metric-label">Clean-down</p>
                <p className="font-mono text-sm font-bold text-foreground mt-1">
                  {allergenCheck.cleanDownRequired ? 'REQUIRED' : 'NOT REQUIRED'}
                </p>
              </div>
              <div className="data-card p-3 text-center">
                <p className="metric-label">Status</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {statusIcon(allergenCheck.cleanDownStatus)}
                  <span className="text-sm font-medium text-foreground">{allergenCheck.cleanDownStatus}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: BOM availability */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">BOM Availability</h2>
            <div className="space-y-2">
              {bomItems.map(item => (
                <div key={item.lotCode} className={cn(
                  "flex items-center gap-3 rounded-lg border p-3",
                  item.status === 'AVAILABLE' ? "border-border" :
                  item.status === 'EXPIRING' ? "border-status-warning" :
                  "border-status-critical"
                )}>
                  {statusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.ingredient}</p>
                    <p className="text-[10px] text-muted-foreground">Lot: {item.lotCode} · Exp: {item.expiryDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-foreground">
                      {item.quantityAvailable}/{item.quantityRequired} {item.unit}
                    </p>
                    <span className={cn("text-[10px] font-medium",
                      item.status === 'AVAILABLE' ? 'text-status-running' :
                      item.status === 'EXPIRING' ? 'text-status-warning' :
                      'text-status-critical'
                    )}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Operator assignment */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Assign Operators</h2>
            <p className="text-sm text-muted-foreground">Minimum 2 operators required. Unqualified operators cannot be assigned to CCP tasks.</p>
            <div className="space-y-2">
              {assignableOperators.map(op => (
                <button
                  key={op.id}
                  onClick={() => op.qualification !== 'NOT-QUALIFIED' && toggleOperator(op.id)}
                  disabled={op.qualification === 'NOT-QUALIFIED'}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                    selectedOperators.includes(op.id) ? "border-primary bg-primary/10" :
                    op.qualification === 'NOT-QUALIFIED' ? "border-border opacity-50 cursor-not-allowed" :
                    "border-border hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    selectedOperators.includes(op.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {selectedOperators.includes(op.id) ? <Check className="h-4 w-4" /> : op.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{op.name}</p>
                    <p className="text-[10px] text-muted-foreground">{op.role}</p>
                  </div>
                  <span className={cn("text-[10px] font-medium rounded px-1.5 py-0.5",
                    op.qualification === 'QUALIFIED' ? 'bg-status-running/20 text-status-running' :
                    op.qualification === 'EXPIRING' ? 'bg-status-warning/20 text-status-warning' :
                    'bg-status-critical/20 text-status-critical'
                  )}>
                    {op.qualification}
                    {op.qualificationExpiry && ` (${op.qualificationExpiry})`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Confirm & start */}
        {currentStep === 6 && selectedProduct && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Confirm & Start Run</h2>
            <div className="rounded-lg border border-status-running bg-status-running/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-status-running" />
                <span className="font-semibold text-foreground">All Pre-Start Checks Passed</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Product:</span> <span className="text-foreground">{selectedProduct.name}</span></div>
                <div><span className="text-muted-foreground">Line:</span> <span className="text-foreground">{selectedProduct.line}</span></div>
                <div><span className="text-muted-foreground">SKU:</span> <span className="font-mono text-foreground">{selectedProduct.sku}</span></div>
                <div><span className="text-muted-foreground">Target:</span> <span className="font-mono text-foreground">{selectedProduct.targetQuantity.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Recipe:</span> <span className="font-mono text-foreground">{selectedProduct.recipeVersion}</span></div>
                <div><span className="text-muted-foreground">Operators:</span> <span className="font-mono text-foreground">{selectedOperators.length} assigned</span></div>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full h-14 text-lg bg-status-running hover:bg-status-running/90"
            >
              {confirming ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Authenticating...</>
              ) : (
                <><Fingerprint className="h-5 w-5" /> Authenticate & Start Run</>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Biometric signature required — serves as electronic batch record signature</p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(s => s - 1)}
          disabled={currentStep === 0}
          className="flex-1"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(s => s + 1)}
            disabled={!canProceed()}
            className="flex-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
