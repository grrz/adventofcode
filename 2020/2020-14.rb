def _input()
	f = File.open('2020-14-input')
	f.read.split("\n").map { |l| m = l.match(/(\w+)(\[(\d+)\])? = (\w+)/); m[3].nil? ? [m[1].to_sym, m[4]] : [m[1].to_sym, m[3].to_i, m[4].to_i] }
end

 # [:mask, "0110XX10XX100111101011X1X010110X00X1"],
 # [:mem, 55972, 5779],

$mem = []
$mem2 = {}
$mask_or = 0
$mask_and = 0

$B36 = (1 << 36) - 1

def set_mem1(a, v)
	$mem[a] = v & $mask_and | $mask_or
	pp "#{a}: #{$mem[a]} (#{$mem[a].to_s(2)})"
end

def set_mask1(m)
	$mask_or = m.gsub('X', '0').to_i(2)
	$mask_and = m.gsub('X', '1').to_i(2)
	pp " or: #{$mask_or} #{$mask_or.to_s(2)}"
	pp "and: #{$mask_and} #{$mask_and.to_s(2)}"
end


def get_addrs(a)
	a = a & ($B36 - $mask_and.sum) | $mask_or
	(0..2**$mask_and.size-1).map { |i|
		a + (0..$mask_and.size-1).map { |d| i & 1 << d != 0 ? $mask_and[d] : 0 }.sum
	}
end

def set_mem2(a, v)
	aa = get_addrs a
	pp "mem2: #{aa.size}"
	aa.each { |addr| $mem2[addr] = v }
end

def set_mask2(m)
	$mask_or = m.gsub('X', '0').to_i(2)
	$mask_and = m.gsub('1', '0').enum_for(:scan, 'X').map { 1 << (m.size - 1 - Regexp.last_match.offset(0).first) }.reverse
	pp " or: #{$mask_or} #{$mask_or.to_s(2)}"
	pp "and: #{$mask_and}"
end

# set_mask2 "0110001011100111101011X1X010110000X0"
# get_addrs "10110".to_i 2

_input.each { |i|
	case i[0]
	when :mask
		set_mask2 i[1]
	when :mem
		set_mem2 i[1], i[2]
	end
}

# pp $mem.map { |v| v || 0 }.sum
pp $mem2.values.sum
