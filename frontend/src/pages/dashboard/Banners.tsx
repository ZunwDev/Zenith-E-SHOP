import { BannerFilter, BannerGrid } from "@/components/dashboard/banners/components";
import { FullSidebar, SheetSidebar } from "@/components/dashboard/components";
import { Limit, NoDataFound, PageHeader, ResetFilter, SearchBar } from "@/components/dashboard/global";
import { User } from "@/components/header";
import { Chip, ChipGroup, ChipGroupContent, ChipGroupTitle } from "@/components/ui/chip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NewButton } from "@/components/util";
import { useAdminCheck, useApiData } from "@/hooks";
import { fetchFilterData } from "@/lib/api";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { Category, Checked, Status, initialCheckedState } from "@/lib/interfaces";
import { buildQueryParams, getAmountOfValuesInObjectOfObjects } from "@/lib/utils";
import { BookPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";

export default function Banners() {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  useAdminCheck();

  // Filter related
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [checked, setChecked] = useState<Checked>(initialCheckedState);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState({
    category: [] as Category[],
    status: [] as Status[],
  });
  const filterAmount = useMemo(() => getAmountOfValuesInObjectOfObjects(checked), [checked]);

  // Debounced values
  const [dbcSearch] = useDebounce(searchQuery, 250);

  const APIURL = useMemo(() => {
    const pageQueryParam = parseInt(queryParams.get("p")) || 1;
    const paramsObj = {
      limit,
      page: pageQueryParam - 1,
      searchQuery: dbcSearch || "",
      category: checked.category,
      status: checked.status,
    };

    return buildQueryParams(paramsObj);
  }, [checked, limit, dbcSearch, queryParams]);

  const handleResetFilters = useCallback(() => {
    setChecked(initialCheckedState);
  }, []);

  const { data: pageData, loading: pageLoading, error: pageError } = useApiData("banners", APIURL, [APIURL]);
  const { data: amountData, loading: amountLoading, error: amountError } = useApiData("banners/amounts", APIURL, [APIURL]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch filter data
        const [categoryData, , , , statusData] = await fetchFilterData();
        setFilterData({ category: categoryData, status: statusData });
      } catch (error) {
        console.error("Error fetching filter data:", error.response?.data?.message || error.message);
      }
    };

    fetchData();
  }, [APIURL]);

  const handleChipRemove = useCallback(
    (key, idToRemove) => {
      // Update the checked state
      setChecked((prevChecked) => {
        const updatedChecked = { ...prevChecked };
        updatedChecked[key] = updatedChecked[key].filter((id) => id !== idToRemove);
        return updatedChecked;
      });
    },
    [setChecked]
  );

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <FullSidebar />
        <div className="flex flex-col">
          <div className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SheetSidebar />
            <div className="ml-auto">
              <User />
            </div>
          </div>
          <main className="flex flex-1 flex-col gap-2 p-4 lg:gap-4 lg:p-6 pt-4">
            <div className="flex items-center justify-between px-4 md:px-0">
              <PageHeader title="Banner Manager" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex md:flex-row flex-wrap md:justify-between items-center xs:px-4 sm:px-0 gap-1.5">
                <div className="flex flex-row gap-1.5">
                  <BannerFilter filterAmount={filterAmount} checked={checked} setChecked={setChecked} amountData={amountData} />
                  <SearchBar setSearchQuery={setSearchQuery} type="banners" className="md:flex hidden" />
                </div>
                <div className="flex flex-row gap-1.5">
                  <Limit setLimit={setLimit} limit={limit} type="Banners" />
                  {pageData?.totalElements > 0 && (
                    <NewButton path="banners" icon={<BookPlus />} type="Banner" className="ml-auto" />
                  )}
                </div>
                <SearchBar setSearchQuery={setSearchQuery} type="banners" className="md:hidden flex w-full" />
              </div>
              {filterAmount > 0 && (
                <ScrollArea className="w-full overflow-y-hidden whitespace-nowrap">
                  {Object.entries(checked)
                    .reverse()
                    .map(([key, value], index) => {
                      if (value.length > 0) {
                        return (
                          <ChipGroup key={index}>
                            <ChipGroupTitle>{key.capitalize()}:</ChipGroupTitle>
                            <ChipGroupContent>
                              {value.map((item, index) => (
                                <Chip key={index} onRemove={() => handleChipRemove(key, item)}>
                                  {filterData &&
                                    filterData[key]
                                      .filter((filtered) => filtered[key + "Id"] === item)
                                      .map((filteredItem) => filteredItem.name)}
                                </Chip>
                              ))}
                            </ChipGroupContent>
                          </ChipGroup>
                        );
                      }
                      return null;
                    })}
                  <ResetFilter onReset={handleResetFilters} filterAmount={filterAmount} />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </div>
            <div
              className={`flex flex-1 ${
                !pageData || Object.keys(pageData)?.length === 0 ? "items-center justify-center" : "items-start w-full"
              } p-4 rounded-lg border-2 border-dashed shadow-sm`}>
              <div className="flex flex-col items-center gap-2 text-center w-full">
                {!pageData || Object.keys(pageData)?.length === 0 ? (
                  <>
                    <NoDataFound
                      filterAmount={filterAmount}
                      dbcSearch={dbcSearch}
                      type="banners"
                      description="You can start advertising stuff as soon as you add an active banner."
                    />
                    <NewButton path="banners" icon={<BookPlus />} type="Banner" className="mt-2" />
                  </>
                ) : (
                  <BannerGrid data={pageData} pageError={pageError} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
