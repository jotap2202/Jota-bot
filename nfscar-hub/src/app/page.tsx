"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { supabase } from "@/lib/supabase";
import { formatDateShort, getFullShortURL, generateShortCode, copyToClipboard } from "@/lib/utils";
import { Business, Location, NFCCard, NFCCardWithRelations } from "@/types";
import { Plus, Copy, ExternalLink, Edit2, Trash2 } from "lucide-react";

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [cards, setCards] = useState<NFCCardWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<NFCCard | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [cardDestination, setCardDestination] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [businessesData, locationsData, cardsData] = await Promise.all([
        supabase.from("businesses").select("*"),
        supabase.from("locations").select("*"),
        supabase
          .from("nfc_cards")
          .select("*, location:locations(*), business:businesses(*)")
          .order("created_at", { ascending: false }),
      ]);

      setBusinesses(businessesData.data || []);
      setLocations(locationsData.data || []);
      setCards(cardsData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBusiness = async () => {
    if (!businessName.trim()) return;

    try {
      const { data } = await supabase
        .from("businesses")
        .insert([{ name: businessName }])
        .select()
        .single();

      if (data) {
        setBusinesses([...businesses, data]);
        setBusinessName("");
        setIsAddBusinessOpen(false);
      }
    } catch (error) {
      console.error("Error adding business:", error);
    }
  };

  const handleAddLocation = async () => {
    if (!selectedBusiness || !locationName.trim() || !googleReviewUrl.trim()) return;

    try {
      const { data } = await supabase
        .from("locations")
        .insert([
          {
            business_id: selectedBusiness,
            name: locationName,
            address: locationAddress,
            google_review_url: googleReviewUrl,
          },
        ])
        .select()
        .single();

      if (data) {
        setLocations([...locations, data]);
        setLocationName("");
        setLocationAddress("");
        setGoogleReviewUrl("");
        setIsAddLocationOpen(false);
      }
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleCreateCard = async () => {
    if (!selectedLocation) return;

    try {
      const shortCode = generateShortCode();
      const location = locations.find((l) => l.id === selectedLocation);

      const { data } = await supabase
        .from("nfc_cards")
        .insert([
          {
            location_id: selectedLocation,
            short_code: shortCode,
            destination_url: location?.google_review_url || "",
            is_active: true,
          },
        ])
        .select()
        .single();

      if (data) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleUpdateCard = async () => {
    if (!selectedCard) return;

    try {
      await supabase
        .from("nfc_cards")
        .update({ destination_url: cardDestination })
        .eq("id", selectedCard.id);

      await fetchData();
      setIsEditCardOpen(false);
      setSelectedCard(null);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleToggleCardStatus = async (card: NFCCard) => {
    try {
      await supabase
        .from("nfc_cards")
        .update({ is_active: !card.is_active })
        .eq("id", card.id);

      await fetchData();
    } catch (error) {
      console.error("Error toggling card status:", error);
    }
  };

  const handleCopyCode = async (code: string) => {
    const fullUrl = `nfcscar.com/r/${code}`;
    await copyToClipboard(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this NFC card?")) return;

    try {
      await supabase.from("nfc_cards").delete().eq("id", cardId);
      await fetchData();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const filteredLocations = selectedBusiness
    ? locations.filter((l) => l.business_id === selectedBusiness)
    : [];

  const filteredCards = selectedLocation
    ? cards.filter((c) => c.location_id === selectedLocation)
    : cards;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header
          title="Review Hub"
          description="Manage your NFC review cards and track customer engagement"
          action={
            <Button onClick={() => setIsAddBusinessOpen(true)} size="md">
              <Plus size={16} className="mr-2" />
              New Business
            </Button>
          }
        />

        {/* Businesses Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Businesses ({businesses.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
              <Card
                key={business.id}
                hoverable
                className="cursor-pointer"
                onClick={() => {
                  setSelectedBusiness(business.id);
                  setSelectedLocation(null);
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {business.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      {locations.filter((l) => l.business_id === business.id)
                        .length}{" "}
                      locations
                    </p>
                  </div>
                  {selectedBusiness === business.id && (
                    <Badge variant="info">Selected</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Locations */}
        {selectedBusiness && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">
                Locations ({filteredLocations.length})
              </h2>
              <Button
                onClick={() => setIsAddLocationOpen(true)}
                variant="secondary"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Add Location
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  hoverable
                  className="cursor-pointer"
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {location.name}
                      </h3>
                      {location.address && (
                        <p className="text-sm text-neutral-600 mt-1">
                          {location.address}
                        </p>
                      )}
                      <p className="text-sm text-neutral-600 mt-2">
                        {cards.filter((c) => c.location_id === location.id)
                          .length}{" "}
                        cards
                      </p>
                    </div>
                    {selectedLocation === location.id && (
                      <Badge variant="info">Selected</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* NFC Cards */}
        {selectedLocation && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">
                NFC Cards ({filteredCards.length})
              </h2>
              <Button
                onClick={handleCreateCard}
                variant="primary"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Create Card
              </Button>
            </div>
            <div className="space-y-4">
              {filteredCards.map((card) => (
                <Card key={card.id} className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    {/* Short Code */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                        Short Code
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="bg-neutral-100 px-3 py-2 rounded font-mono text-sm text-neutral-900">
                          {card.short_code}
                        </code>
                        <button
                          onClick={() => handleCopyCode(card.short_code)}
                          className="p-2 hover:bg-neutral-100 rounded transition-colors"
                          title="Copy short URL"
                        >
                          {copiedCode === card.short_code ? (
                            <span className="text-xs text-status-success">✓</span>
                          ) : (
                            <Copy size={16} className="text-neutral-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Tap Count */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                        Tap Count
                      </p>
                      <p className="text-2xl font-bold text-brand-500">
                        {card.tap_count}
                      </p>
                    </div>

                    {/* Last Tap */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                        Last Tap
                      </p>
                      <p className="text-sm text-neutral-700">
                        {card.last_tap_at
                          ? formatDateShort(card.last_tap_at)
                          : "Never"}
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex gap-2 items-start justify-end">
                      <Badge
                        variant={card.is_active ? "success" : "warning"}
                      >
                        {card.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <button
                        onClick={() => {
                          setSelectedCard(card);
                          setCardDestination(card.destination_url);
                          setIsEditCardOpen(true);
                        }}
                        className="p-2 hover:bg-neutral-100 rounded transition-colors"
                        title="Edit card"
                      >
                        <Edit2 size={16} className="text-neutral-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-2 hover:bg-status-danger/10 rounded transition-colors"
                        title="Delete card"
                      >
                        <Trash2 size={16} className="text-status-danger" />
                      </button>
                    </div>
                  </div>

                  {/* Destination URL */}
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                      Destination URL
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={card.destination_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-500 hover:text-brand-600 truncate flex-1"
                      >
                        {card.destination_url}
                      </a>
                      <ExternalLink size={14} className="text-neutral-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedBusiness && businesses.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600 mb-4">No businesses yet</p>
            <Button onClick={() => setIsAddBusinessOpen(true)}>
              Create Your First Business
            </Button>
          </Card>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddBusinessOpen}
        onClose={() => {
          setIsAddBusinessOpen(false);
          setBusinessName("");
        }}
        title="New Business"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsAddBusinessOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBusiness}
              disabled={!businessName.trim()}
              className="flex-1"
            >
              Create
            </Button>
          </>
        }
      >
        <Input
          label="Business Name"
          placeholder="e.g., ABC Auto Care"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddBusiness()}
        />
      </Modal>

      <Modal
        isOpen={isAddLocationOpen}
        onClose={() => {
          setIsAddLocationOpen(false);
          setLocationName("");
          setLocationAddress("");
          setGoogleReviewUrl("");
        }}
        title="New Location"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsAddLocationOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddLocation}
              disabled={
                !locationName.trim() || !googleReviewUrl.trim()
              }
              className="flex-1"
            >
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Location Name"
            placeholder="e.g., Downtown Location"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
          <Input
            label="Address (optional)"
            placeholder="e.g., 123 Main St"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
          />
          <Input
            label="Google Maps/Review URL"
            placeholder="https://maps.app.goo.gl/..."
            value={googleReviewUrl}
            onChange={(e) => setGoogleReviewUrl(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isEditCardOpen}
        onClose={() => {
          setIsEditCardOpen(false);
          setSelectedCard(null);
          setCardDestination("");
        }}
        title="Edit Card Destination"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditCardOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCard} className="flex-1">
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-1">
              Short Code
            </p>
            <code className="block bg-neutral-100 px-3 py-2 rounded font-mono text-sm text-neutral-900">
              {selectedCard?.short_code}
            </code>
          </div>
          <Input
            label="Destination URL"
            placeholder="https://..."
            value={cardDestination}
            onChange={(e) => setCardDestination(e.target.value)}
          />
          <p className="text-xs text-neutral-600">
            Update this URL to change where NFC taps redirect to without rewriting the card.
          </p>
        </div>
      </Modal>
    </div>
  );
}
